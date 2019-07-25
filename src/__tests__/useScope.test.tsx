import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import useHotkeys from '../useHotkeys'
import useScope from '../useScope'
import { HotkeysProvider } from '../context'

import fireKeydownEvent from './helpers/fireKeydownEvent'

interface ComponentProps {
  hotkeys: string
  callback: jest.Mock<any, [any]>
  scope: string[]
}

const setup = (
  hotkeys: ComponentProps['hotkeys'],
  callback: ComponentProps['callback'],
  scope: ComponentProps['scope'],
  appScope: ComponentProps['scope']
) => {
  const Component = (props: ComponentProps) => {
    useScope(appScope)

    useHotkeys(props.hotkeys, event => {
      props.callback(event)
    }, props.scope)

    return null
  }

  return render(
    <HotkeysProvider>
      <Component
        hotkeys={hotkeys}
        callback={callback}
        scope={scope}
      />
    </HotkeysProvider>
  )
}

afterEach(cleanup)

describe('no scope', () => {
  test('triggers callback', () => {
    const spy = jest.fn()

    setup('z', spy, undefined, ['modal', 'global'])
    fireKeydownEvent('z')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('scope is active', () => {
  test('triggers callback', () => {
    const spy = jest.fn()

    setup('z', spy, ['global'], ['modal', 'global'])
    fireKeydownEvent('z')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('scope is not active', () => {
  test('does not trigger callback', () => {
    const spy = jest.fn()

    setup('z', spy, ['modal'], ['modal', 'global'])
    fireKeydownEvent('z')
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
