import { HttpClient } from '@/domain/contracts/http'
import { UnauthorizedError, UnexpectedError } from '@/domain/errors'
import { Address } from '@/domain/models'

type Setup = (url: string, httpClient: HttpClient<Address[]>) => ListAddresses
type Output = void
export type ListAddresses = () => Promise<Output>

export const listAddressesUseCase: Setup = (url, httpClient) => async () => {
  const { statusCode } = await httpClient.request({ url, method: 'get' })

  switch (statusCode) {
    case 200: break
    case 401: throw new UnauthorizedError()
    default: throw new UnexpectedError()
  }
}
