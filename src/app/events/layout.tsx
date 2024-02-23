import { ApolloWrapper } from './apollo-wrapper'
import { SideMenu } from '@/ui/side-menu/side-menu'
import React from 'react'
import { getClient } from '@/lib/client'
import { ListSportsDocument } from '@/gql/documents.generated'
import { Sport } from '@/gql/types.generated'

export default async function EventsLayout({ children }: { children: React.ReactNode }) {
  const data = await getClient(false).query({
    query: ListSportsDocument,
  })
  const sports = data.data.listSports as Sport[]

  return (
    <>
      <head>
        <link rel="stylesheet" href="/global.css" />
        <script src="/ui.js" async></script>
      </head>
      <ApolloWrapper>
        <SideMenu sports={sports} />
        {children}
      </ApolloWrapper>
    </>
  )
}
