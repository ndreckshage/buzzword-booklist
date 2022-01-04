import { GraphQLResolveInfo } from 'graphql';
import { BookModel } from '../repo/books';
import { RootBookListComponentModel, RootComponentModel, RootLayoutComponentModel } from '../repo/components';
import { ListModel } from '../repo/lists';
import { ResolverContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Book = {
  __typename?: 'Book';
  googleBooksVolumeId: Scalars['String'];
  id: Scalars['ID'];
  image: Scalars['String'];
  title: Scalars['String'];
};

export type BookCardComponent = {
  __typename?: 'BookCardComponent';
  href: Scalars['String'];
  id: Scalars['ID'];
  image: Scalars['String'];
};

export type BookCarouselComponent = {
  __typename?: 'BookCarouselComponent';
  bookCards: Array<BookCardComponent>;
  id: Scalars['ID'];
  link: LinkComponent;
  title: Scalars['String'];
};

export type BookGridComponent = {
  __typename?: 'BookGridComponent';
  bookCards: Array<BookCardComponent>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type BookListComponent = {
  __typename?: 'BookListComponent';
  bookCards: Array<BookCardComponent>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type Component = BookCardComponent | BookCarouselComponent | BookGridComponent | BookListComponent | HeroComponent | LayoutComponent;

export enum ComponentContextType {
  Author = 'AUTHOR',
  Book = 'BOOK',
  Category = 'CATEGORY',
  List = 'LIST',
  None = 'NONE'
}

export type CurrentUser = {
  __typename?: 'CurrentUser';
  layoutComponents: Array<LayoutComponent>;
  lists: Array<List>;
  name: Scalars['String'];
};

export type HeroComponent = {
  __typename?: 'HeroComponent';
  id: Scalars['ID'];
  subTitle: Scalars['String'];
  title: Scalars['String'];
};

export type LayoutComponent = {
  __typename?: 'LayoutComponent';
  components: Array<Component>;
  createdBy: Scalars['String'];
  flexDirection: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type LinkComponent = {
  __typename?: 'LinkComponent';
  href: Scalars['String'];
  title: Scalars['String'];
  variant: LinkComponentVariant;
};

export enum LinkComponentVariant {
  Button = 'BUTTON',
  Default = 'DEFAULT'
}

export type List = {
  __typename?: 'List';
  books: Array<Book>;
  createdBy: Scalars['String'];
  id: Scalars['ID'];
  key: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookToList: Scalars['Boolean'];
  createComponentInLayout: Scalars['Boolean'];
  createLayoutComponent?: Maybe<Scalars['Boolean']>;
  createList?: Maybe<Scalars['Boolean']>;
  removeBookFromList: Scalars['Boolean'];
  updateHeroComponent: Scalars['Boolean'];
  updateLayoutComponent: Scalars['Boolean'];
};


export type MutationAddBookToListArgs = {
  googleBooksVolumeId: Scalars['String'];
  listKey: Scalars['String'];
};


export type MutationCreateComponentInLayoutArgs = {
  componentType: Scalars['String'];
  layoutId: Scalars['ID'];
};


export type MutationCreateLayoutComponentArgs = {
  title: Scalars['String'];
};


export type MutationCreateListArgs = {
  title: Scalars['String'];
};


export type MutationRemoveBookFromListArgs = {
  googleBooksVolumeId: Scalars['String'];
  listKey: Scalars['String'];
};


export type MutationUpdateHeroComponentArgs = {
  componentId: Scalars['ID'];
  subTitle?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateLayoutComponentArgs = {
  componentOrder?: InputMaybe<Array<Scalars['ID']>>;
  flexDirection?: InputMaybe<Scalars['String']>;
  layoutId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  component?: Maybe<Component>;
  currentUser?: Maybe<CurrentUser>;
  layout?: Maybe<LayoutComponent>;
  list?: Maybe<List>;
};


export type QueryComponentArgs = {
  id: Scalars['ID'];
};


export type QueryLayoutArgs = {
  contextKey: Scalars['String'];
  contextType: ComponentContextType;
  id: Scalars['ID'];
};


export type QueryListArgs = {
  listKey: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Book: ResolverTypeWrapper<BookModel>;
  BookCardComponent: ResolverTypeWrapper<BookCardComponent>;
  BookCarouselComponent: ResolverTypeWrapper<RootBookListComponentModel>;
  BookGridComponent: ResolverTypeWrapper<RootBookListComponentModel>;
  BookListComponent: ResolverTypeWrapper<RootBookListComponentModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Component: ResolverTypeWrapper<RootComponentModel>;
  ComponentContextType: ComponentContextType;
  CurrentUser: ResolverTypeWrapper<Omit<CurrentUser, 'layoutComponents' | 'lists'> & { layoutComponents: Array<ResolversTypes['LayoutComponent']>, lists: Array<ResolversTypes['List']> }>;
  HeroComponent: ResolverTypeWrapper<RootComponentModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  LayoutComponent: ResolverTypeWrapper<RootLayoutComponentModel>;
  LinkComponent: ResolverTypeWrapper<LinkComponent>;
  LinkComponentVariant: LinkComponentVariant;
  List: ResolverTypeWrapper<ListModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: BookModel;
  BookCardComponent: BookCardComponent;
  BookCarouselComponent: RootBookListComponentModel;
  BookGridComponent: RootBookListComponentModel;
  BookListComponent: RootBookListComponentModel;
  Boolean: Scalars['Boolean'];
  Component: RootComponentModel;
  CurrentUser: Omit<CurrentUser, 'layoutComponents' | 'lists'> & { layoutComponents: Array<ResolversParentTypes['LayoutComponent']>, lists: Array<ResolversParentTypes['List']> };
  HeroComponent: RootComponentModel;
  ID: Scalars['ID'];
  LayoutComponent: RootLayoutComponentModel;
  LinkComponent: LinkComponent;
  List: ListModel;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type BookResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  googleBooksVolumeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCardComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCardComponent'] = ResolversParentTypes['BookCardComponent']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCarouselComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCarouselComponent'] = ResolversParentTypes['BookCarouselComponent']> = {
  bookCards?: Resolver<Array<ResolversTypes['BookCardComponent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['LinkComponent'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookGridComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookGridComponent'] = ResolversParentTypes['BookGridComponent']> = {
  bookCards?: Resolver<Array<ResolversTypes['BookCardComponent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookListComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookListComponent'] = ResolversParentTypes['BookListComponent']> = {
  bookCards?: Resolver<Array<ResolversTypes['BookCardComponent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Component'] = ResolversParentTypes['Component']> = {
  __resolveType: TypeResolveFn<'BookCardComponent' | 'BookCarouselComponent' | 'BookGridComponent' | 'BookListComponent' | 'HeroComponent' | 'LayoutComponent', ParentType, ContextType>;
};

export type CurrentUserResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['CurrentUser'] = ResolversParentTypes['CurrentUser']> = {
  layoutComponents?: Resolver<Array<ResolversTypes['LayoutComponent']>, ParentType, ContextType>;
  lists?: Resolver<Array<ResolversTypes['List']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HeroComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['HeroComponent'] = ResolversParentTypes['HeroComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LayoutComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['LayoutComponent'] = ResolversParentTypes['LayoutComponent']> = {
  components?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  flexDirection?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['LinkComponent'] = ResolversParentTypes['LinkComponent']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variant?: Resolver<ResolversTypes['LinkComponentVariant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['List'] = ResolversParentTypes['List']> = {
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addBookToList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddBookToListArgs, 'googleBooksVolumeId' | 'listKey'>>;
  createComponentInLayout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCreateComponentInLayoutArgs, 'componentType' | 'layoutId'>>;
  createLayoutComponent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateLayoutComponentArgs, 'title'>>;
  createList?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateListArgs, 'title'>>;
  removeBookFromList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveBookFromListArgs, 'googleBooksVolumeId' | 'listKey'>>;
  updateHeroComponent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateHeroComponentArgs, 'componentId'>>;
  updateLayoutComponent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateLayoutComponentArgs, 'layoutId'>>;
};

export type QueryResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  component?: Resolver<Maybe<ResolversTypes['Component']>, ParentType, ContextType, RequireFields<QueryComponentArgs, 'id'>>;
  currentUser?: Resolver<Maybe<ResolversTypes['CurrentUser']>, ParentType, ContextType>;
  layout?: Resolver<Maybe<ResolversTypes['LayoutComponent']>, ParentType, ContextType, RequireFields<QueryLayoutArgs, 'contextKey' | 'contextType' | 'id'>>;
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType, RequireFields<QueryListArgs, 'listKey'>>;
};

export type Resolvers<ContextType = ResolverContext> = {
  Book?: BookResolvers<ContextType>;
  BookCardComponent?: BookCardComponentResolvers<ContextType>;
  BookCarouselComponent?: BookCarouselComponentResolvers<ContextType>;
  BookGridComponent?: BookGridComponentResolvers<ContextType>;
  BookListComponent?: BookListComponentResolvers<ContextType>;
  Component?: ComponentResolvers<ContextType>;
  CurrentUser?: CurrentUserResolvers<ContextType>;
  HeroComponent?: HeroComponentResolvers<ContextType>;
  LayoutComponent?: LayoutComponentResolvers<ContextType>;
  LinkComponent?: LinkComponentResolvers<ContextType>;
  List?: ListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

