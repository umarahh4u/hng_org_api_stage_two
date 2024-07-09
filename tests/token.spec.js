import { describe, it, expect, beforeEach, vi } from "vitest";
import jwt from "jsonwebtoken";
import { createSendToken } from "../controllers/handlerFactory";

vi.mock("jsonwebtoken");
vi.spyOn(Date, "now").mockImplementation(() => 1620000000000); // Mock current date

describe("createSendToken", () => {
  //Arrange
  let req, res, user;

  beforeEach(() => {
    req = {
      secure: false,
      header: vi.fn().mockReturnValue("https"),
    };

    res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    user = {
      _id: "1234567890",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      password: "password123",
      organisations: ["org1", "org2"],
      __v: 0,
    };

    process.env.JWT_COOKIE_EXPIRES_IN = "3"; // 3 minutes
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_EXPIRES_IN = "3m"; // 3 minutes
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  //   it("should create and send token with correct expiration and user details", () => {
  //     const mockToken = "mockToken";
  //     jwt.sign.mockReturnValue(mockToken);

  //     createSendToken(user, 201, req, res);

  //     const expectedExpiryDate = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 minutes in milliseconds

  //     expect(jwt.sign).toHaveBeenCalledWith(
  //       { id: user._id },
  //       process.env.JWT_SECRET,
  //       {
  //         expiresIn: process.env.JWT_EXPIRES_IN,
  //       }
  //     );

  //     expect(res.cookie).toBe("jwt", mockToken, {
  //       expires: expectedExpiryDate,
  //       httpOnly: true,
  //       secure: true,
  //     });

  //     expect(user.password).toBeUndefined();
  //     expect(user.__v).toBeUndefined();
  //     expect(user.organisations).toBeUndefined();

  //     expect(res.status).toBe(201);
  //     expect(res.json).toBe({
  //       status: "success",
  //       message: "Registration successful",
  //       data: {
  //         accessToken: mockToken,
  //         user: {
  //           _id: "1234567890",
  //           firstName: "John",
  //           lastName: "Doe",
  //           email: "john.doe@example.com",
  //           phone: "123-456-7890",
  //         },
  //       },
  //     });

  //     // Verify the token payload
  //     const tokenPayload = { id: user._id };
  //     const tokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN };
  //     const decodedToken = jwt.sign.mock.calls[0][0]; // Get the payload from the mock call

  //     expect(decodedToken).toEqual(tokenPayload);
  //     expect(jwt.sign.mock.calls[0][2]).toEqual(tokenOptions); // Verify options
  //   });

  it("should handle insecure requests correctly", () => {
    req.secure = true;
    req.header.mockReturnValue("http");
    createSendToken(user, 201, req, res);
    expect(res.cookie.mock.calls[0][2].secure).toBe(true);
  });

  it("should handle secure requests correctly", () => {
    req.secure = true;
    req.header.mockReturnValue("https");
    createSendToken(user, 201, req, res);
    expect(res.cookie.mock.calls[0][2].secure).toBe(true);
  });
});
