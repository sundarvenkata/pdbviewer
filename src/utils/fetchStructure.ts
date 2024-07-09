import axios from 'axios';

export const fetchStructure = async (input: string): Promise<string> => {
    if (input.length > 4) {
        const searchUrl = "https://search.rcsb.org/rcsbsearch/v2/query";
        const searchQuery = {
            query: {
                type: "terminal",
                service: "text",
                parameters: {
                    attribute: "rcsb_polymer_entity_name_com.name",
                    operator: "contains_words",
                    value: input
                }
            },
            return_type: "entry"
        };
        const response = await axios.get(searchUrl, {
            params: {
                json: JSON.stringify(searchQuery)
            }
        });

        // @ts-ignore
        const pdbIds = response.data.result_set.map(({identifier}) => identifier);
        if (pdbIds.length === 0) throw new Error('No structure found for this gene');
        input = pdbIds[0];
    }
    const response = await axios.get(`https://files.rcsb.org/download/${input}.pdb`);
    return response.data;
};
