import { useContext, useEffect } from 'react';
import { HotkeysContext } from './context';

function useScope(scopes: string[]) {
  const { addScopes, removeScopes } = useContext(HotkeysContext);

  useEffect(() => {
    addScopes(scopes);
    return () => removeScopes(scopes);
  }, []);
}

export default useScope;
