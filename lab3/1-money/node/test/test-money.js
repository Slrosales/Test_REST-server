import assert from 'assert';
import Money from '../src/money.js';
import {expect, should} from 'chai';

should();

describe('Money', function () {
  describe('#add()', function () { 
    // the test was not working because the variable m1 was not initialized before each test this means that the value of m1 was not reset to a new instance of Money before each test case, leading to unexpected results.
    let m1;
    beforeEach(function () { // with beforeEach, we ensure that m1 is initialized before each test case, 
    // this means that each test will have a fresh instance of m1, 
    // preventing any side effects from previous tests.
      m1 = new Money(10.0, 'EUR');
    });

    it('should correctly add two moneys with the same currency', function () {
      let m2 = new Money(20.0, 'EUR');

      m1.add(m2); // Add the amount of m2 up to the amount of m1. m1 est updated.

      let newAmount = m1.amount, // Retrieve the new amount
        oracle = 30.0; // Comparison to the expected result this means that we expect the new amount to be 30.0 after adding 10.0 and 20.0

      assert.equal(
        newAmount,
        oracle,
        `m1 worth ${newAmount}€ while it should be ${oracle}€`
      );
    });

    it('should correctly add two moneys with different currencies', function () {
      let m2 = new Money(20.0, 'USD');

      m1.add(m2); // Add the amount of m2 up to the amount of m1. m1 est updated.

      let newAmount = m1.amount, // Retrieve the new amount
        oracle = 20.0; // Comparison to the expected result

      assert.equal(newAmount, oracle); // Assertion for comparisx`on
    });

    it('should throw an exception when the currency is neither EUR nor USD', function () {
      let m2 = new Money(20.0, 'BRL'); // BZR : Brazilian real

      assert.throws(function () {
        // Catch the exception
        m1.add(m2);
      });
    });

    it('should use EUR and zero as default values using expect', function () {
      const money = new Money();

      expect(money).to.deep.equal({
        amount: 0.0,
        currency: 'EUR',
      });
    });

    it('should preserve the amount when adding an unsupported currency', function () {
      (() => m1.add(new Money(20.0, 'BRL'))).should.throw();

      m1.should.have.property('amount', 10.0);
      m1.should.have.property('currency', 'EUR');
    });

  });
});
