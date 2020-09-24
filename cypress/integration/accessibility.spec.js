context('Accessibility', () => {
	it('Check a11y violations on load', () => {
		cy.fixture('pages').then((pages) => {
			pages.selection.forEach((page) => {
				cy.visit(page.href);
				cy.injectAxe();
				cy.get('.' + page.bodyClass).should('be.visible');
				// All impacts: 'moderate', 'serious', 'critical'
				let impactsToCheck = [ 'critical' ];
				cy.checkA11y(
					{ exclude: [ [ 'input[type="search"]' ] ] },
					{
						includedImpacts: impactsToCheck
					}
				);
			});
		});
	});
});
