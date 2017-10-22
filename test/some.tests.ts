import { expect } from "chai";

describe('something', () => {
    it("does something", () => {
        const result = 'hi';
        const expected = 'hi';

        expect(result).to.eql(expected);
    });
});