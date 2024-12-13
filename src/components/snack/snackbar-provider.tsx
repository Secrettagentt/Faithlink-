'use client'

import { closeSnackbar, SnackbarProvider as NotistackProvider } from 'notistack'
import { useRef } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa'
import styled from 'styled-components'
import { StyledIcon, StyledNotistack } from './styles'

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode
}

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  margin-right: 10px;
  color: inherit;
`

export default function Layout({ children }: Props) {
  const notistackRef = useRef<any>(null)

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      variant='success'
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      iconVariant={{
        default: (
          <StyledIcon color='primary'>
            <FaInfoCircle size={24} />
          </StyledIcon>
        ),
        success: (
          <StyledIcon color='success'>
            <FaCheckCircle size={24} />
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color='secondary'>
            <FaExclamationTriangle size={24} />
          </StyledIcon>
        ),
        error: (
          <StyledIcon color='error'>
            <FaTimesCircle size={24} />
          </StyledIcon>
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      action={(snackbarId) => (
        <CloseButton onClick={() => closeSnackbar(snackbarId)}>
          <FaTimes size={16} />
        </CloseButton>
      )}
    >
      {children}
    </NotistackProvider>
  )
}
