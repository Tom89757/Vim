### vim-find

### vim-sneak

Based on [vim-sneak](https://github.com/justinmk/vim-sneak), it allows for jumping to any location specified by two characters.

| Setting                            | Description                                                 | Type    | Default Value |
| ---------------------------------- | ----------------------------------------------------------- | ------- | ------------- |
| vim.sneak                          | Enable/disable vim-sneak                                    | Boolean | false         |
| vim.sneakUseIgnorecaseAndSmartcase | Respect `vim.ignorecase` and `vim.smartcase` while sneaking | Boolean | false         |

Once sneak is active, initiate motions using the following commands. For operators sneak uses `z` instead of `s` because `s` is already taken by the surround plugin.

| Motion Command            | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `s<char><char>`           | Move forward to the first occurrence of `<char><char>`                  |
| `S<char><char>`           | Move backward to the first occurrence of `<char><char>`                 |
| `<operator>z<char><char>` | Perform `<operator>` forward to the first occurrence of `<char><char>`  |
| `<operator>Z<char><char>` | Perform `<operator>` backward to the first occurrence of `<char><char>` |
