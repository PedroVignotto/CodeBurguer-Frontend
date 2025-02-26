import { DefaultButton, Input, Spinner } from '@/application/components'
import { Validator } from '@/application/validation'
import { Default } from '@/application/layouts'
import { AddAddress, SearchAddress } from '@/domain/use-cases/address'

import { Container } from './styles'

import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

type Props = { validation: Validator, searchAddress: SearchAddress, addAddress: AddAddress }

export const RegisterAddress: React.FC<Props> = ({ validation, searchAddress, addAddress }) => {
  const navigate = useNavigate()

  const [formSearchVisible, setFormSearchVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  const [district, setDistrict] = useState('')
  const [street, setStreet] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [complement, setComplement] = useState('')
  const [zipCodeError, setZipCodeError] = useState<string | undefined>('')
  const [number, setNumber] = useState('')
  const [numberError, setNumberError] = useState<string | undefined>('')
  const [surname, setSurname] = useState('')
  const [surnameError, setSurnameError] = useState<string | undefined>('')

  useEffect(() => setZipCodeError(validation.validate('zipCode', { zipCode })), [zipCode])
  useEffect(() => setNumberError(validation.validate('number', { number })), [number])
  useEffect(() => setSurnameError(validation.validate('surname', { surname })), [surname])

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (loading || zipCodeError) return

      setLoading(true)

      const { district, street } = await searchAddress({ zipCode })

      setStreet(street)
      setDistrict(district)
      setFormSearchVisible(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (loading || numberError || surnameError) return

      setLoading(true)

      await addAddress({ zipCode, surname, district, street, number: +number, complement })

      navigate('/profile')
    } catch (error: any) {
      setLoading(false)

      toast.error(error.message)
    }
  }

  return (
    <Default>
      <Container>
      {formSearchVisible
        ? <form data-testid="form-search" onSubmit={handleSearchSubmit}>
            <Input type="text" name="zipCode" placeholder="Informe seu CEP" state={zipCodeError} setState={setZipCode} />
            <DefaultButton type="submit" disabled={!!zipCodeError}>{loading ? <Spinner /> : 'Buscar'}</DefaultButton>
          </form>
        : <form data-testid="form-add" onSubmit={handleAddSubmit}>
            <section>
              <Input type="text" name="district" placeholder="Bairro" value={district} setState={setDistrict} readOnly />
              <Input type="text" name="zipCode" placeholder="CEP" value={zipCode} setState={setZipCode} readOnly />
            </section>
            <section>
              <Input type="text" name="street" placeholder="Rua" value={street} setState={setStreet} readOnly />
              <Input type="text" name="number" placeholder="Número" state={numberError} setState={setNumber} />
            </section>
            <Input type="text" name="complement" placeholder="Complemento" setState={setComplement} />
            <Input type="text" name="surname" placeholder="Apelido" state={surnameError} setState={setSurname} />
            <DefaultButton type="submit" disabled={!!numberError || !!surnameError}>{loading ? <Spinner /> : 'Adicionar'}</DefaultButton>
          </form>
      }
      </Container>
    </Default>
  )
}
