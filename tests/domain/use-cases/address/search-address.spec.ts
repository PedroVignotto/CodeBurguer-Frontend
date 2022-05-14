import { addressParams, httpClientParams } from '@/tests/mocks'
import { searchAddressUseCase, SearchAddress } from '@/domain/use-cases/address'
import { HttpClient } from '@/domain/contracts/http'
import { FieldNotFoundError } from '@/domain/errors'

import { mock } from 'jest-mock-extended'

describe('SearchAddressUseCase', () => {
  let sut: SearchAddress

  const { zipCode } = addressParams
  const { url } = httpClientParams

  const httpClient = mock<HttpClient>()

  beforeAll(() => {
    httpClient.request.mockResolvedValue({ statusCode: 200 })
  })

  beforeEach(() => {
    sut = searchAddressUseCase(url, httpClient)
  })

  it('Should call HttpClient with correct values', async () => {
    await sut({ zipCode })

    expect(httpClient.request).toHaveBeenCalledWith({ url: `${url}/${zipCode}`, method: 'get' })
    expect(httpClient.request).toHaveBeenCalledTimes(1)
  })

  it('Should throw FieldNotFound if HttpClient returns 400', async () => {
    httpClient.request.mockResolvedValueOnce({ statusCode: 400 })

    const promise = sut({ zipCode })

    await expect(promise).rejects.toThrow(new FieldNotFoundError('zipCode'))
  })
})
