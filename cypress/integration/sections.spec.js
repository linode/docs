context('Sections', () => {
	const sectionFirstLevel = '/sections/docs/applications/';
	it('Guides first level, show guides', () => {
		cy.visit(sectionFirstLevel);
		cy.get('.kind-section').should('be.visible');
		cy.get('[data-testid=showGuides]').click();
		cy.get('.text-2').should('contain', 'Applications Guides');
	});

	it('Guides first level, sort', () => {
		cy.visit(sectionFirstLevel);
		cy.get('[data-testid=showGuides]').click();
		cy.get('[data-testid=openSort]').click();
		let sortBy = [ 'Category', 'Alphabetically', 'Published date', 'Modified date' ];
		let idxes = [ 3, 0, 1, 2 ];
		let sortOpts = [ 'sortDown', 'sortUp', 'sortTitle' ];

		const sortedItem = function() {
			return cy.get('[data-testid=sorted-item]:visible').first();
		};
		//

		for (let i = 0; i < sortBy.length; i++) {
			let idx = idxes[i];
			sortOpts.forEach((opt) => {
				sortedItem().then(($els) => {
					cy.get(`[data-testid=${opt}]`).eq(idx).as('item');
					cy.get('@item').parent().parent().contains(sortBy[idx], { matchCase: false });
					cy.get('@item').click();

					if (opt !== 'sortTitle') {
						// Check that the order has changed.
						// The sortTitle sort can be the same as the previous, so skip that for now.
						sortedItem().then(($els2) => {
							expect($els[0]).to.not.eql($els2[0]);
						});
					}
				});
			});
		}
	});
});
