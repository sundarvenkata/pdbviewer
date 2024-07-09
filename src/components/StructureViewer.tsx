import React, { useEffect, useRef } from 'react';
import { Viewer } from '@rcsb/rcsb-molstar/build/src/viewer';
import { BuiltInTrajectoryFormats } from 'molstar/lib/mol-plugin-state/formats/trajectory';

interface StructureViewerProps {
    pdbData: string;
}

export const StructureViewer = ({ pdbData }: StructureViewerProps) => {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewerRef.current && pdbData) {
            const viewer = new Viewer(viewerRef.current);
            viewer.loadStructureFromData(pdbData, "pdb", false);
        }
    }, [pdbData]);

    return <div ref={viewerRef} style={{ width: '100%', height: '80%', position: 'relative'}} />;
};
