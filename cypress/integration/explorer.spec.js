context('Explorer', () => {
	beforeEach(() => {
		cy.get('.explorer-toggle__header').contains('Explore docs', { matchCase: false }).click();
	});

	it('Navigate down to a Guide page', () => {
		for (let level = 1; level <= 3; level++) {
			cy.get(`[data-testid=open-${level}]:visible`).eq(1).click();
		}
		cy.get('.page-link:visible').eq(1).click();
		cy.get('.kind-page').should('be.visible');
	});

	it('Navigate down to an API page', () => {
		cy.get('[data-testid=node-api]').find('[data-testid=open-1]').click();
		cy.get(`[data-testid=open-2]:visible`).eq(1).click();
		let link = cy.get('.page-link:visible').eq(1);
		link.click();
		link.should('have.class', 'text-brand');
		cy.get('.type-api').should('be.visible');
	});

	it('Searching should limit the number of nodes', () => {
		cy.get('[data-testid=node-docs]').find('[data-testid=open-1]').click();
		const len = () => {
			return cy.get('[data-testid=li-1]').eq(1).find('[data-testid=li-2]:visible').its('length');
		};

		// The current number of top level categories in Guides is 15, but that may change.
		len().should('be.within', 12, 18);

		//Scroll to top to make the search input visible.
		cy.scrollTo(0);

		cy.get('[data-testid=search-input]').type('Github ');
		cy.get('h2').contains('Top Results in Guides', { matchCase: false });

		// I suspect this is a bug in Cypress as the waiting should be done automacially in the next step.
		cy.wait(2000);

		// Current number is 6.
		len().should('be.within', 4, 8);
	});
});
