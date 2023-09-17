import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SearchContainer = styled.div`
  margin-bottom: 1.6rem;
`

const StyledInput = styled.input`
  width: 100%;
`

interface ISearch {
    callBack: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
}

const Search = ({ callBack, placeholder }: ISearch) => (
  <SearchContainer>
    <StyledInput
      onChange={callBack}
      placeholder={placeholder}
    />
  </SearchContainer>
)

Search.propTypes = {
  callBack: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default Search