/**
 * Return the factorial of i.
 * @param {number} i - an integer number.
 * @return {number} the factorial of i.
 */
export const factorial = function (i) {
  if (!Number.isInteger(i) || i < 0) {
    throw new TypeError('factorial requires a non-negative integer');
  }

  let result = 1;
  for (let value = 2; value <= i; value += 1) {
    result *= value;
  }

  return result;
};

export default factorial;
