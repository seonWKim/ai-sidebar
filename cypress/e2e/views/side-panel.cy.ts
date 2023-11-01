describe('SiePanel.vue spec', () => {
  it('Check necessary components are visible', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cy-chat').should('be.visible');
    cy.get('.cy-settings').should('be.visible');
    cy.get('.cy-themes').should('be.visible');
  });

  it('Check configuration buttons when "Text" is selected', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cy-chat-type-selector-button > .v-btn__content').contains('TEXT');
    cy.get('.cy-message-template-modal-button > .v-btn__content').contains('TEMPLATE');
    cy.get('.cy-openai-context-memorizer-modal-button >.v-btn__content').contains(/MEMORIZING...|FORGETTING.../g);
    cy.get('.cy-openai-model-selector-button >.v-btn__content').contains('GPT-3.5-TURBO');
    cy.get('.cy-openai-temperature-modal-button >.v-btn__content').contains('TEMPERATURE');
  });

  it('Check configuration buttons when "Image" is selected', () => {
    cy.visit('http://localhost:3000');
    cy.get('.cy-chat-type-selector-button > .v-btn__content').click();
    cy.get('.cy-chat-type-selector-Image > .v-list-item__content > .v-list-item-title').click();
    cy.get('.cy-chat-type-selector-button > .v-btn__content').contains('IMAGE');
    cy.get('.cy-message-template-modal-button > .v-btn__content').contains('TEMPLATE');
    cy.get('.cy-openai-image-configuration-modal-button > .v-btn__content').contains('SETTINGS');
  });
});
