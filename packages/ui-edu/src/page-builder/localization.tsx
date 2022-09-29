import { AppsRounded, Template } from "grommet-icons";
import { PageBuilderLocalization } from "./page-builder";

export const defaultLocalization : PageBuilderLocalization = {
    elementCategories: {
      layout: {
        title: 'Layout',
        icon: <Template/>,
      },
      "standard-element": {
        title: 'Standard Elements',
        icon: <AppsRounded/>,
      }
    },
  }