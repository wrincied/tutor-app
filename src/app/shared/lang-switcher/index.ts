import { LangFlagComponent } from './lang-flag.component';
import { LangSwitcherComponent } from './lang-switcher.component';

export { LangFlagComponent, LangSwitcherComponent };

export const LANG_SWITCHER_IMPORTS = [LangSwitcherComponent, LangFlagComponent] as const;
