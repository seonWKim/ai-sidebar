describe('SiePanel.vue spec', () => {
  it('Configuration buttons when "Text" is selected', () => {
    cy.visit("http://localhost:3000");
    cy.get('.cy-chat-type-selector-button > .v-btn__content').contains('TEXT');
    cy.get('.cy-message-template-modal-button > .v-btn__content').contains('TEMPLATE');
    cy.get('.cy-openai-context-memorizer-modal-button > .v-btn__content').contains(/MEMORIZING...|FORGETTING.../g);
    cy.get('.cy-openai-model-selector-button > .v-btn__content').contains('GPT-3.5-TURBO');
    cy.get('.cy-openai-temperature-modal-button > .v-btn__content').contains('TEMPERATURE');
  })
})
