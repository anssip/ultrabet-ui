import { ApolloWrapper } from './apollo-wrapper'

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>
}
