import * as React from 'react'
import { cleanup, render, getByText } from 'react-testing-library'
import useHotkeys from '../useHotkeys'
import useScope from '../useScope'
import { HotkeysProvider, HotkeysConsumer, HotkeysContext } from '../context'

const setup = (
  defaultScope: string[] = [],
  scopesToAdd: string[],
  scopesToRemove: string[]
) => {
  class Consumer extends React.Component {
    componentDidMount () {
      scopesToAdd && this.context.addScopes(scopesToAdd)
      scopesToRemove && this.context.removeScopes(scopesToRemove)
    }

    render () {
      return this.context.activeScope || null
    }
  }
  Consumer.contextType = HotkeysContext

  return render(
    <HotkeysProvider defaultScope={defaultScope}>
      <Consumer />
    </HotkeysProvider>
  )
}

afterEach(cleanup)

describe('Provider', () => {
  describe('noScopes', () => {
    test('returns null', () => {
      const wrapper = setup()
      expect(wrapper.queryByText('modal')).toBeNull()
    })
  })

  describe('addScopes', () => {
    test('adds scopes to state', () => {
      const wrapper = setup([], 'modal')
      expect(wrapper.queryByText('modal')).toBeTruthy()
    })
  })

  describe('removeScopes', () => {
    test('removes scopes from state', () => {
      const wrapper = setup(['modal'], undefined, ['modal'])
      expect(wrapper.queryByText('modal')).toBeNull()
    })
  })

  describe('activeScope', () => {
    test('selects the last active scope', () => {
      const wrapper = setup(['modal', 'popup'])
      expect(wrapper.queryByText('popup')).toBeTruthy()
    })
  })
})

