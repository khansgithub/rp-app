import React, { forwardRef } from "react";
import type { RefreshRef } from '@/app/types';

export interface FooProps { }

const Foo = React.memo(
    forwardRef<RefreshRef, FooProps>((props, ref) => {
        console.log("Foo rendered");
        return "";
    }), () => { return true });

export default Foo