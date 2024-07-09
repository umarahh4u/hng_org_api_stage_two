// import { describe, it, expect, beforeEach, vi } from "vitest";
// import mongoose from "mongoose";
// import { getOneOrg } from "../controllers/handlerFactory";

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

// vi.mock("../utils/catchAsync", () => ({ default: catchAsync }));

// describe("getOneOrg", () => {
//   let req, res, next, Model, user, org;

//   beforeEach(() => {
//     user = {
//       _id: new mongoose.Types.ObjectId().toString(),
//     };

//     org = {
//       _id: new mongoose.Types.ObjectId().toString(),
//       users: [user._id],
//     };

//     req = {
//       params: {
//         orgId: org._id,
//       },
//       user,
//     };

//     res = {
//       status: vi.fn().mockReturnThis(),
//       json: vi.fn(),
//     };

//     next = vi.fn();

//     Model = {
//       findById: vi.fn().mockResolvedValue(org),
//     };
//   });

//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   it("should return the organization if the user belongs to it", async () => {
//     const getOrg = getOneOrg(Model);

//     await getOrg(req, res, next);

//     expect(Model.findById).toHaveBeenCalledWith(org._id);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       status: "success",
//       message: "User record retrieved successfully",
//       data: org,
//     });
//   });

//   it("should return 403 if the user does not belong to the organization", async () => {
//     org.users = [];
//     Model.findById.mockResolvedValue(org);
//     const getOrg = getOneOrg(Model);

//     await getOrg(req, res, next);

//     expect(Model.findById).toHaveBeenCalledWith(org._id);
//     expect(res.status).toHaveBeenCalledWith(403);
//     expect(res.json).toHaveBeenCalledWith({
//       status: "Forbidden",
//       message: "You do not belong to this organization",
//     });
//   });

//   it("should return 404 if the organization is not found", async () => {
//     Model.findById.mockResolvedValue(null);
//     const getOrg = getOneOrg(Model);

//     await getOrg(req, res, next);

//     expect(Model.findById).toHaveBeenCalledWith(req.params.orgId);
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({
//       status: "Not Found",
//       message: "No document found with that ID",
//     });
//   });
// });
