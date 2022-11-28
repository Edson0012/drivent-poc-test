import supertest from "supertest";
import httpStatus from "http-status";
import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser, craeteTicketTypeValid, craeteTicketTypeInvalid } from "../factories";
import * as jwt from "jsonwebtoken";
import { connectDb } from "@/config";

const server = supertest(app);

beforeAll(async () => {
  await connectDb();
});

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = "askdaskdaskdak";
    
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should answer status 404 if enrollment is not found", async () => {
      const token = await generateValidToken();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should answer status 404 if ticket is not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("it should respond status 401 if the ticket found is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await craeteTicketTypeValid();
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("it should respond status 401 if the ticket found is not online", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await craeteTicketTypeInvalid();
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
