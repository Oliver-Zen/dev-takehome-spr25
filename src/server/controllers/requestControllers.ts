import { Request, Response } from "express";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import {
  InputException,
  InvalidPaginationError,
} from "@/lib/errors/inputExceptions";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import RequestModel from "@/models/requestModels";

// PUT /api/request
export const createRequest = async (req: Request, res: Response) => {
  try {
    const { title, description, status, requestorName, itemRequested } =
      req.body;

    // Additional custom validation
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new InvalidInputError(
        "status: must be one of 'pending', 'approved', or 'rejected'"
      );
    }

    // Mongoose auto-validation occurs here
    const newRequest = await RequestModel.create({
      title,
      description,
      status,
      requestorName,
      itemRequested,
      requestCreatedDate: new Date(),
      lastEditedDate: new Date(),
    });

    res
      .status(201)
      .json({ message: "Request created successfully.", request: newRequest });
  } catch (error: unknown) {
    if (error instanceof InputException) {
      res.status(error.code).json({ error: error.message });
    } else if (error instanceof Error && error.name === "ValidationError") {
      throw new InvalidInputError(
        `Mongoose validation failed: ${error.message}`
      );
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
};

// GET /api/request?page=_
export const getRequests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = PAGINATION_PAGE_SIZE;

    if (page < 1) {
      throw new InvalidPaginationError(page, pageSize);
    }

    const totalRequests = await RequestModel.countDocuments();
    const requests = await RequestModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ requestCreatedDate: -1 });

    res.status(200).json({
      page,
      pageSize,
      totalRequests,
      totalPages: Math.ceil(totalRequests / pageSize),
      requests,
    });
  } catch (error) {
    if (error instanceof InputException) {
      res.status(error.code).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
};
