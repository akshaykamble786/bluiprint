import { ActionContext } from '@/context/action-context';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect, useRef, useState } from 'react'

const SandpackPreviewClient = () => {
    const previewRef = useRef();
    const { sandpack } = useSandpack();
    const { action, setAction } = useContext(ActionContext);
    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
        if (sandpack && action) {
            const timer = setTimeout(() => {
                GetSandpackClient();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [sandpack, action]);

    const GetSandpackClient = async () => {
        try {
            const client = previewRef.current?.getClient();

            if (!client) {
                console.error('Sandpack client not initialized');
                return;
            }

            const res = await client.getCodeSandboxURL();
            if (!res?.sandboxId) {
                console.error('No sandbox ID received');
                return;
            }

            if (action?.actionType === 'deploy') {
                window.open(`https://${res.sandboxId}.csb.app/`);
            } else if (action?.actionType === 'export') {
                window.open(res.editorUrl);
            }
        } catch (error) {
            console.error('Error getting Sandpack client:', error);
        }
    }
    return (
        <div className='w-full'>
            <SandpackPreview ref={previewRef} style={{ height: '80vh' }} showNavigator={true} />
        </div>
    )
}

export default SandpackPreviewClient