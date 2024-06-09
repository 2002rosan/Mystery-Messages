import DBConnection from "@/lib/DBConnction";
import UserModel from "@/model/User";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: z
    .string()
    .min(4, "Username must contain 4 characters atleast!")
    .max(10, "Username should not have more than 10 characters!")
    .regex(/^[a-zA-z0-9]+$/, "Username must not contain special characters"),
});

export async function GET(request: Request) {
  await DBConnection();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // Zod implementation
    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid query params",
          error: result.error,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return Response.json(
      {
        success: false,
        message: "Error: ",
        error,
      },
      { status: 500 }
    );
  }
}
