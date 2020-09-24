// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';

const trustArcIframe = "iframe[title='TrustArc Cookie Consent Manager']";

Cypress.on('window:before:load', (win) => {
	cy.spy(win.console, 'error');
});

const getTrustArcDocument = () => {
	return cy.get(trustArcIframe).its('0.contentDocument').should('exist');
};

const getTrustArcBody = () => {
	return getTrustArcDocument().its('body').should('not.be.undefined').then(cy.wrap);
};

beforeEach(() => {
	cy.clearLocalStorage();
	cy.clearCookies();
	cy.visit('/');
	cy.wait(500);
	cy.get('body').then(($body) => {
		if ($body.find(trustArcIframe).length) {
			getTrustArcBody().find('.pdynamicbutton .call').click();
		}
	});
});

afterEach(() => {
	cy.window().then((win) => {
		expect(win.console.error).to.have.callCount(0);
	});
});
