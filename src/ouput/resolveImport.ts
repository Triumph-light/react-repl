export default function () {
    return {
        visitor: {
            ImportDeclaration(node) {
                console.log('node', node)
                // if(node.type === 'ImportDeclaration') {
                //     const source: string = node.source.value
                //     if(source.startsWith('./')){

                //     }
                // }
            }
        }
    }
}