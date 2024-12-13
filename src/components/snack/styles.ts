'use client'

import { MaterialDesignContent } from 'notistack'
import styled from 'styled-components'

export const StyledNotistack = styled(MaterialDesignContent)`
  ${({}) => {
    return `
      & #notistack-snackbar {
        padding: 0;
        flex-grow: 1;
      }
      &.notistack-MuiContent {
        color: black;
        font-size: bold;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 8px;
        background-color: white;
      }
      &.notistack-MuiContent-default {
        color: black;
        background-color: white;
      }
    `
  }}
`

type StyledIconProps = {
  color: 'primary' | 'success' | 'secondary' | 'error'
}

export const StyledIcon = styled.span<StyledIconProps>`
  ${({}) => `
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border-radius: 8px;
    color: black;
    background-color: white;
  `}
`
