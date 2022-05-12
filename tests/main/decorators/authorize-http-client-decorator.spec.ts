import { accountParams, httpClientParams } from '@/tests/mocks'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { GetStorage } from '@/domain/contracts/cache'

import { mock } from 'jest-mock-extended'
import { HttpClient } from '@/domain/contracts/http'

describe('AuthorizeHttpClientDecorator', () => {
  let sut: AuthorizeHttpClientDecorator

  const { name, accessToken } = accountParams
  const { url, method, body, headers } = httpClientParams

  const getStorage = mock<GetStorage>()
  const httpClient = mock<HttpClient>()

  beforeAll(() => {
    getStorage.get.mockReturnValue({ name, accessToken })
  })

  beforeEach(() => {
    sut = new AuthorizeHttpClientDecorator(getStorage, httpClient)
  })

  it('Should call GetStorage with correct value', async () => {
    await sut.request({ url, method, body, headers })

    expect(getStorage.get).toHaveBeenCalledWith({ key: 'account' })
  })

  it('Should not add headers if GetStorage is invalid', async () => {
    getStorage.get.mockReturnValueOnce(null)

    await sut.request({ url, method })

    expect(httpClient.request).toHaveBeenCalledWith({ url, method })
  })

  it('Should add headers to HttpClient', async () => {
    await sut.request({ url, method })

    expect(httpClient.request).toHaveBeenCalledWith({ url, method, headers: { authorization: `Bearer: ${accessToken}` } })
  })
})
