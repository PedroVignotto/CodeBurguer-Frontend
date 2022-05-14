import { Address as AdressModel } from '@/domain/models'

import { Container } from './styles'

import { FiEdit, FiMoreVertical, FiTrash2 } from 'react-icons/fi'
import React, { useState } from 'react'

type Props = { address: AdressModel }

export const Address: React.FC<Props> = ({ address }) => {
  const [handleOpenDetails, setHandleOpenDetails] = useState(false)

  return (
    <Container details={handleOpenDetails}>
      <div>
        <div>
          <FiEdit />
          <FiTrash2 />
        </div>
        <main>
          <h3>{address.surname}</h3>
          <p>{address.street}, {address.number}{address.complement && `, ${address.complement}`}</p>
          <p>{address.district}, {address.zipCode}</p>
        </main>
      </div>
      <FiMoreVertical onClick={() => setHandleOpenDetails(!handleOpenDetails)} />
    </Container>
  )
}
