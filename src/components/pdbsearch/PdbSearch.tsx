import React, {useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import debounce from 'lodash/debounce';
import {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    AutocompleteValue
} from "@mui/base/useAutocomplete/useAutocomplete";


interface OptionType {
    text?: string;
    score?: number;
}

const suggestionsToOptions = (suggestions: object): OptionType[] => {
    if (suggestions !== undefined) {
        const suggestionsMap = new Map(Object.entries(suggestions));
        const allSuggestions = suggestionsMap.get("rcsb_entity_source_organism.rcsb_gene_name.value") ?? suggestionsMap.get("rcsb_entry_container_identifiers.entry_id") ?? [];
        return allSuggestions.map((item: any) => {
            return new Option(item.text, item.score)
        });
    }
    return [];
}

interface PdbSearch2Props {
    onChange: (input: string) => Promise<void>
}

export const PdbSearch = ({onChange}: PdbSearch2Props): React.JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<OptionType[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const debouncedGetSuggestions = debounce((searchText: string) => {
        const searchQuery = {
            type: "basic",
            suggest: {
                text: searchText
            },
            highlight: {
                highlighter_type: "plain",
                pre_tag: "",
                post_tag: ""
            }
        };
        if (searchText.length > 2) {
            axios.get('https://search.rcsb.org/rcsbsearch/v2/suggest', {
                params: {json: JSON.stringify(searchQuery)}
            })
                .then(response => {
                    setOptions(suggestionsToOptions(response.data?.suggestions)); // Assuming the API returns an array of suggestions
                })
                .catch(error => console.error('Error fetching suggestions:', error));
        }
    }, 300);

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
        debouncedGetSuggestions(newInputValue);
    };

    const handleOnChange = (_event: React.SyntheticEvent,
                            selectedOption: AutocompleteValue<any, any, any, any>,
                            reason: any,
                            details?: any) => {
        onChange(selectedOption?.label);
    };

    return (
        <Autocomplete
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleOnChange}
            options={options}
            getOptionLabel={(option: OptionType) => option.text || ''}
            renderInput={(params) => (
                <TextField {...params} label="Search" variant="outlined"/>
            )}
        />
    );
};

