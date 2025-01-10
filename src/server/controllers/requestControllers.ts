import type { Request, Response } from "express";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { RESPONSES } from "@/lib/types/apiResponse";
import RequestModel from "@/models/requestModels";

export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newReq = await RequestModel.create(req.body);
    res.status(RESPONSES.CREATED.code).json({
      message: RESPONSES.CREATED.message,
      data: {
        req: newReq,
      },
    });
  } catch (error) {
    // unknown type by default
    if (error instanceof Error) {
      // console.error(error.message);
      res.status(RESPONSES.INVALID_INPUT.code).json({
        error: error.message,
      });
    }
  }
};

export const getRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10);
    const status = req.query.status as string;

    if (isNaN(page) || page < 1) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        // `return` stops the function
        message: RESPONSES.INVALID_INPUT.message,
        error: "Page must be a number greater than 0",
      });
      return;
    }

    const filter: Partial<{ status: string }> = {};
    if (status) {
      filter.status = status;
    }

    const reqs = await RequestModel.find(filter)
      .limit(PAGINATION_PAGE_SIZE)
      .skip(PAGINATION_PAGE_SIZE * (page - 1))
      .sort("-createdDate");

    res.status(RESPONSES.SUCCESS.code).json({
      message: RESPONSES.SUCCESS.message,
      data: {
        total: reqs.length,
        reqs: reqs,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(RESPONSES.INVALID_INPUT.code).json({
      message: RESPONSES.INVALID_INPUT.message,
    });
  }
};

export const updateRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        message: RESPONSES.INVALID_INPUT.message,
        error: "Both id and status are required",
      });
      return;
    }

    const validStatuses = ["pending", "completed", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        message: RESPONSES.INVALID_INPUT.message,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status, lastEditedDate: new Date() }, // Update status and last edited date
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        message: RESPONSES.INVALID_INPUT.message,
        error: "Request not found",
      });
      return;
    }

    res.status(RESPONSES.SUCCESS.code).json({
      message: "successfully updated",
      data: { updatedRequest },
    });
  } catch (error) {
    console.error(error);
    res.status(RESPONSES.UNKNOWN_ERROR.code).json({
      message: RESPONSES.UNKNOWN_ERROR.message,
    });
  }
};

export const batchEditRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        message: RESPONSES.INVALID_INPUT.message,
        error: "'updates' must be a non-empty array",
      });
      return;
    }

    const validStatuses = ["pending", "completed", "approved", "rejected"];

    for (const update of updates) {
      const { id, status } = update;

      if (!id || !validStatuses.includes(status)) {
        res.status(RESPONSES.INVALID_INPUT.code).json({
          message: RESPONSES.INVALID_INPUT.message,
          error: "Invalid update data. Ensure valid id and status.",
        });
        return;
      }

      await RequestModel.findByIdAndUpdate(
        id,
        { status, lastEditedDate: new Date() },
        { new: true }
      );
    }

    res.status(RESPONSES.SUCCESS.code).json({
      message: RESPONSES.SUCCESS.message,
      data: { updated: updates.length },
    });
  } catch (error) {
    console.error(error);
    res.status(RESPONSES.UNKNOWN_ERROR.code).json({
      message: RESPONSES.UNKNOWN_ERROR.message,
    });
  }
};

export const batchDeleteRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { deletions } = req.body;

    if (!deletions || !Array.isArray(deletions) || deletions.length === 0) {
      res.status(RESPONSES.INVALID_INPUT.code).json({
        message: RESPONSES.INVALID_INPUT.message,
        error: "'deletions' must be a non-empty array",
      });
      return;
    }

    await RequestModel.deleteMany({ _id: { $in: deletions } });

    res.status(RESPONSES.SUCCESS.code).json({
      message: RESPONSES.SUCCESS.message,
      data: { deleted: deletions.length },
    });
  } catch (error) {
    console.error(error);
    res.status(RESPONSES.UNKNOWN_ERROR.code).json({
      message: RESPONSES.UNKNOWN_ERROR.message,
    });
  }
};
