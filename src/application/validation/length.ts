import { FieldValidation } from '@/application/validation'
import { InvalidFieldError } from '@/application/validation/errors'

export class LengthValidation implements FieldValidation {
  constructor (readonly field: string, private readonly length: number) {}

  validate (input: object): Error | undefined {
    return new InvalidFieldError()
  }
}
