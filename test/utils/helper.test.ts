import { arrify, detectEOL } from "../../src/utils/helper";

describe("utils", () => {
  describe("arrify", () => {
    it("should convert set to array", () => {
      expect(arrify(new Set([1, 2]))).toEqual([1, 2]);
    });
  });

  describe("detectEOL", () => {
    it("should fallback to \\n", () => {
      expect(detectEOL("a")).toEqual("\n");
    });

    it("should detect \\r", () => {
      expect(detectEOL("a\r")).toEqual("\r");
    });

    it("should detect \\r\\n", () => {
      expect(detectEOL("a\r\n")).toEqual("\r\n");
    });
  });
});
