context('Search', () => {
	const assertHasSearchResult = function() {
		cy.get('h2').contains('Top Results in Guides', { matchCase: false });
	};

	it('Searching for Kubernetes should show search results and make the word green', () => {
		cy.get('[data-testid=search-input]').type('Kubernetes ');
		assertHasSearchResult();
		cy.get('#navbar__search-input span.bg-brand.text-white').contains('Kubernetes');
	});

	it('Clicking on a tag should show a filtered search', () => {
		cy.visit('/networking/dns/previewing-websites-without-dns');
		cy.get('.kind-page').should('be.visible');
		cy.get("[href='#?tags=networking']").first().click();
		assertHasSearchResult();
	});
});
