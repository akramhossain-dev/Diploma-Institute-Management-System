import "./setupEnv.js";
import { test } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../src/utils/hashHelper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../src/utils/generateToken.js";

test("Hash Helper — Password Hashing and Comparison", async (t) => {
  await t.test("should successfully hash a password and match it", async () => {
    const password = "SuperSecretPassword123";
    const hash = await hashPassword(password);
    
    assert.ok(hash);
    assert.notStrictEqual(hash, password);
    
    const isMatch = await comparePassword(password, hash);
    assert.strictEqual(isMatch, true);
  });

  await t.test("should fail comparison with incorrect password", async () => {
    const password = "SuperSecretPassword123";
    const hash = await hashPassword(password);
    
    const isMatch = await comparePassword("wrong_password", hash);
    assert.strictEqual(isMatch, false);
  });
});

test("Token Generator — JWT Flow", async (t) => {
  const authId = new mongoose.Types.ObjectId();
  const entityId = new mongoose.Types.ObjectId();
  const entityType = "student";

  await t.test("should generate valid short-lived access token", () => {
    const token = generateAccessToken({ authId, entityType, entityId });
    assert.ok(token);

    const decoded = verifyAccessToken(token);
    assert.strictEqual(decoded.sub, authId.toString());
    assert.strictEqual(decoded.entityId, entityId.toString());
    assert.strictEqual(decoded.entityType, entityType);
  });

  await t.test("should generate valid long-lived refresh token", () => {
    const token = generateRefreshToken({ authId, entityType, entityId });
    assert.ok(token);

    const decoded = verifyRefreshToken(token);
    assert.strictEqual(decoded.sub, authId.toString());
    assert.strictEqual(decoded.entityId, entityId.toString());
    assert.strictEqual(decoded.entityType, entityType);
  });

  await t.test("should throw verification error for malformed token", () => {
    assert.throws(() => verifyAccessToken("invalid.token.here"));
  });
});
