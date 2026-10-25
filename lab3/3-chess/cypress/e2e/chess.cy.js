import game from '../../games/2022-03-07-game.json';

const squareSelector = (rank, file) =>
  `#chessboard > div.rank:nth-child(${9 - rank}) > div:nth-child(${file})`;

describe('Chess game', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/web/index.html');
  });

  it('moves a white pawn to a valid empty square', () => {
    const whitePawn = cy
      .get('#chessboard .rank')
      .eq(6)
      .children()
      .eq(0);
    const emptyTarget = cy
      .get('#chessboard .rank')
      .eq(5)
      .children()
      .eq(0);

    whitePawn.click();
    emptyTarget.click();

    cy.get('#history > div p')
      .should('have.length', 1)
      .and('contain.text', 'white Pawn moved from')
      .and('contain.text', 'a2 to')
      .and('contain.text', 'a3');
    emptyTarget
      .find('img')
      .should('have.attr', 'src')
      .and('include', 'pawn_white.png');
    whitePawn.find('img').should('not.exist');
  });

  it('replays the recorded game', () => {
    game.forEach((action) => {
      if (action.type === 'move') {
        const from = squareSelector(
          action.from.rank,
          action.from.file
        );

        const to = squareSelector(
          action.to.rank,
          action.to.file
        );

        // Select the piece and move it
        cy.get(from).click();
        cy.get(to).click();

        // Check that the destination contains a piece
        cy.get(to).find('img').should('exist');

        // Check that the origin is now empty
        cy.get(from).find('img').should('not.exist');

      } else if (action.type === 'capture') {
        // Check that the capture is recorded in the history
        cy.get('#history > div p')
          .should('contain.text', `${action.color} `)
          .and('contain.text', 'has been captured');
      }
    });
  });
});
