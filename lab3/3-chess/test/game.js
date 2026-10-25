import * as game from '../games/2022-03-07-game.json' with { type: 'json' };
import assert from 'assert';
import Color from '../src/color.js';
import Chessboard from '../src/chessboard.js';

/**
 * From a file number, get the corresponding letter.
 * Rank are 1-indexed.
 * Letters are 97-indexed to get lower-alpha characters.
 * @param {number} file - the file in its number representation.
 * @return {string} returns the file in its string representation.
 */
const convertFileToString = function (file) {
  return String.fromCharCode(97 - 1 + file);
};

describe('Game', function () {
  let chessboard;
  let capturedPiece;

  before(function () {
    chessboard = new Chessboard();
    chessboard.init();
  });

  describe('#move and #capture', function () {
    game.default.forEach((action) => {
      if (action.type === 'move') {
        it(`${action.color} piece should move from ${convertFileToString(action.from.file)}${action.from.rank} to ${convertFileToString(action.to.file)}${action.to.rank}`, function () {
          const piece = chessboard.getPiece(action.from.rank, action.from.file);
          const target = chessboard.getPiece(action.to.rank, action.to.file);
          const color = Color[action.color.toUpperCase()];

          assert.notEqual(piece, null);
          assert.equal(piece.color, color);

          if (target !== null) {
            assert.notEqual(target.color, color);
          }

          assert.equal(piece.canMove(action.to.rank, action.to.file), true);

          capturedPiece = target;
          piece.move(action.to.rank, action.to.file);
          assert.equal(chessboard.getPiece(action.to.rank, action.to.file), piece);
        });
      } else {
        it(`${action.color} piece should be captured at ${convertFileToString(action.at.file)}${action.at.rank}`, function () {
          const color = Color[action.color.toUpperCase()];

          assert.notEqual(capturedPiece, null);
          assert.equal(capturedPiece.color, color);
          assert.equal(capturedPiece.isCaptured, true);
          assert.equal(capturedPiece.rank, -1);
          assert.equal(capturedPiece.file, -1);
          assert.notEqual(
            chessboard.getPiece(action.at.rank, action.at.file),
            capturedPiece
          );
        });
      }
    });
  });
});
