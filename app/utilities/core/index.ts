type RouteMatch = {
    id: string;
    pathname: string;
    handle: Record<string, string> ;
    params: Record<string, string> ;
    data: Record<string, string> ;
}
export type Breadcrumb = {
    isActive: boolean;
    path: string;
    visited: boolean;
    id: number,
    label: string;

}

export const colorSwitcher = ({ visited, isActive }: Pick<Breadcrumb,'visited'|'isActive'>): string => {
    if (isActive) return "#5845DD";
    if (visited) return "#87839F";
    return "#C9C5E8";
  };
  
export const iterateBreadcrumbs = (breadcrumbs: Array<Breadcrumb>, matches: Array<RouteMatch>) => {
    const { id } = matches.at(-1)
    const step = breadcrumbs.map(({path}) =>path).indexOf(id)
    return breadcrumbs.map(({ path, ...crumb }, index) => ({...crumb, path, visited: step > index, isActive: !!matches.find(({ id }) => id === path),}))
  }