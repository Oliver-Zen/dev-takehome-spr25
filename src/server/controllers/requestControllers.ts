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

export const getRequests = async (req: Request, res: Response) => {
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

//     const reqs = await RequestModel.find(filter)
//       .limit(PAGINATION_PAGE_SIZE)
//       .skip(PAGINATION_PAGE_SIZE * (page - 1))
//       .sort("-createdDate");

//     res.status(RESPONSES.SUCCESS.code).json({
//       message: RESPONSES.SUCCESS.message,
//       data: { reqs },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(RESPONSES.INVALID_INPUT.code).json({
//       message: RESPONSES.INVALID_INPUT.message,
//     });
//   }
// };
