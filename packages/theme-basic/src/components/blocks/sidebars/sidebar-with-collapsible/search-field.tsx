import { Input, InputGroup } from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { useLocalization } from '@abpjs/core'
import { useSearch } from './search-context'

export const SearchField = () => {
  const { t } = useLocalization()
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <InputGroup
      flex="1"
      startElement={<LuSearch />}
    >
      <Input
        placeholder={t('AbpUi::Search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </InputGroup>
  )
}
