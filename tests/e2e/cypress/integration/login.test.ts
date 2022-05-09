import { mockBadRequestError, mockOk, mockServerError, mockUnauthorizedError } from '../mocks'

import faker from 'faker'

describe('Login', () => {
  const baseUrl: string = Cypress.config().baseUrl

  const validEmail: string = faker.internet.email()
  const invalidEmail: string = faker.random.word()
  const password: string = faker.internet.password()
  const name: string = faker.name.findName()
  const accessToken: string = faker.datatype.uuid()

  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getSubmitButton().should('be.disabled').should('have.text', 'Login')
  })

  it('Should keep the button disabled if form is invalid', () => {
    cy.getInputById('email').focus().type(invalidEmail)
    cy.getInputById('password').focus().type(password)

    cy.getInputById('email').should('have.attr', 'title', 'Valor inválido')
    cy.getSubmitButton().should('be.disabled').should('have.text', 'Login')
  })

  it('Should enable the button if form is valid', () => {
    cy.getInputById('email').focus().type(validEmail)
    cy.getInputById('password').focus().type(password)

    cy.getSubmitButton().should('be.enabled').should('have.text', 'Login')
  })

  it('Should present UnexpectedError on 400', () => {
    mockBadRequestError('POST', /login/)

    cy.getInputById('email').focus().type(validEmail)
    cy.getInputById('password').focus().type(password)
    cy.getSubmitButton().click()

    cy.getSubmitButton().should('not.have.text', 'Login')
    cy.contains('Algo deu errado. Tente novamente!')
    cy.getSubmitButton().should('have.text', 'Login')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockUnauthorizedError('POST', /login/)

    cy.getInputById('email').focus().type(validEmail)
    cy.getInputById('password').focus().type(password)
    cy.getSubmitButton().click()

    cy.getSubmitButton().should('not.have.text', 'Login')
    cy.contains('Credenciais inválidas')
    cy.getSubmitButton().should('have.text', 'Login')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError on 500', () => {
    mockServerError('POST', /login/)

    cy.getInputById('email').focus().type(validEmail)
    cy.getInputById('password').focus().type(password)
    cy.getSubmitButton().click()

    cy.getSubmitButton().should('not.have.text', 'Login')
    cy.contains('Algo deu errado. Tente novamente!')
    cy.getSubmitButton().should('have.text', 'Login')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should store account on localStorage if valid credentials are provided', () => {
    mockOk('POST', /login/, { name, accessToken })

    cy.getInputById('email').focus().type(validEmail)
    cy.getInputById('password').focus().type(password)
    cy.getSubmitButton().click()

    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('account')))
  })
})
