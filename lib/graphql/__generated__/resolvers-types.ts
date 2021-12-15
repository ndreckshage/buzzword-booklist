import { GraphQLResolveInfo } from 'graphql';
import { ResolverContext } from '../createContext';
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

export type AlertComponent = Node & {
  __typename?: 'AlertComponent';
  id: Scalars['ID'];
  variant: AlertVariant;
};

export enum AlertVariant {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type BannerComponent = Node & {
  __typename?: 'BannerComponent';
  id: Scalars['ID'];
};

export type BookCarouselComponent = Node & {
  __typename?: 'BookCarouselComponent';
  id: Scalars['ID'];
  items?: Maybe<BookCarouselItemComponentConnection>;
  link?: Maybe<LinkComponent>;
  title: Scalars['String'];
};


export type BookCarouselComponentItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type BookCarouselItemComponent = Node & {
  __typename?: 'BookCarouselItemComponent';
  href: Scalars['String'];
  id: Scalars['ID'];
  image: Scalars['String'];
};

export type BookCarouselItemComponentConnection = {
  __typename?: 'BookCarouselItemComponentConnection';
  edges?: Maybe<Array<Maybe<BookCarouselItemComponentEdge>>>;
  pageInfo: PageInfo;
};

export type BookCarouselItemComponentEdge = {
  __typename?: 'BookCarouselItemComponentEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<BookCarouselItemComponent>;
};

export type BookGridComponent = Node & {
  __typename?: 'BookGridComponent';
  id: Scalars['ID'];
};

export type BookGridItemComponent = Node & {
  __typename?: 'BookGridItemComponent';
  id: Scalars['ID'];
};

export type BookListComponent = Node & {
  __typename?: 'BookListComponent';
  id: Scalars['ID'];
};

export type BookListItemComponent = Node & {
  __typename?: 'BookListItemComponent';
  id: Scalars['ID'];
};

export type BookPageActionComponent = Node & {
  __typename?: 'BookPageActionComponent';
  id: Scalars['ID'];
};

export type BookPageAuthorComponent = Node & {
  __typename?: 'BookPageAuthorComponent';
  id: Scalars['ID'];
};

export type BookPageDescriptionComponent = Node & {
  __typename?: 'BookPageDescriptionComponent';
  id: Scalars['ID'];
};

export type BookPageDetailsComponent = Node & {
  __typename?: 'BookPageDetailsComponent';
  id: Scalars['ID'];
};

export type BookPageGenreComponent = Node & {
  __typename?: 'BookPageGenreComponent';
  id: Scalars['ID'];
};

export type BookPageImageComponent = Node & {
  __typename?: 'BookPageImageComponent';
  id: Scalars['ID'];
};

export type BookPagePriceComponent = Node & {
  __typename?: 'BookPagePriceComponent';
  id: Scalars['ID'];
};

export type Component = AlertComponent | BannerComponent | BookCarouselComponent | BookGridComponent | BookListComponent | BookPageActionComponent | BookPageAuthorComponent | BookPageDescriptionComponent | BookPageDetailsComponent | BookPageGenreComponent | BookPageImageComponent | BookPagePriceComponent | HeroComponent;

export type HeroComponent = Node & {
  __typename?: 'HeroComponent';
  id: Scalars['ID'];
};

export type Layout = SingleColumnLayout | TwoColumnLayout;

export type LinkComponent = Node & {
  __typename?: 'LinkComponent';
  href: Scalars['String'];
  id: Scalars['ID'];
  text: Scalars['String'];
  variant: LinkVariant;
};

export enum LinkVariant {
  CallToAction = 'CALL_TO_ACTION',
  Default = 'DEFAULT'
}

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  bookPageLayout?: Maybe<Layout>;
  collectionPageLayout?: Maybe<Layout>;
  layout?: Maybe<Layout>;
  node?: Maybe<Node>;
};


export type QueryBookPageLayoutArgs = {
  isbn: Scalars['Int'];
};


export type QueryCollectionPageLayoutArgs = {
  collectionId: Scalars['String'];
  collectionType: Scalars['String'];
};


export type QueryLayoutArgs = {
  layoutKey: Scalars['String'];
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type SingleColumnLayout = Node & {
  __typename?: 'SingleColumnLayout';
  components: Array<Component>;
  id: Scalars['ID'];
};

export type TwoColumnLayout = Node & {
  __typename?: 'TwoColumnLayout';
  bottomComponents: Array<Component>;
  id: Scalars['ID'];
  leftComponents: Array<Component>;
  rightComponents: Array<Component>;
  topComponents: Array<Component>;
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
  AlertComponent: ResolverTypeWrapper<AlertComponent>;
  AlertVariant: AlertVariant;
  BannerComponent: ResolverTypeWrapper<BannerComponent>;
  BookCarouselComponent: ResolverTypeWrapper<BookCarouselComponent>;
  BookCarouselItemComponent: ResolverTypeWrapper<BookCarouselItemComponent>;
  BookCarouselItemComponentConnection: ResolverTypeWrapper<BookCarouselItemComponentConnection>;
  BookCarouselItemComponentEdge: ResolverTypeWrapper<BookCarouselItemComponentEdge>;
  BookGridComponent: ResolverTypeWrapper<BookGridComponent>;
  BookGridItemComponent: ResolverTypeWrapper<BookGridItemComponent>;
  BookListComponent: ResolverTypeWrapper<BookListComponent>;
  BookListItemComponent: ResolverTypeWrapper<BookListItemComponent>;
  BookPageActionComponent: ResolverTypeWrapper<BookPageActionComponent>;
  BookPageAuthorComponent: ResolverTypeWrapper<BookPageAuthorComponent>;
  BookPageDescriptionComponent: ResolverTypeWrapper<BookPageDescriptionComponent>;
  BookPageDetailsComponent: ResolverTypeWrapper<BookPageDetailsComponent>;
  BookPageGenreComponent: ResolverTypeWrapper<BookPageGenreComponent>;
  BookPageImageComponent: ResolverTypeWrapper<BookPageImageComponent>;
  BookPagePriceComponent: ResolverTypeWrapper<BookPagePriceComponent>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Component: ResolversTypes['AlertComponent'] | ResolversTypes['BannerComponent'] | ResolversTypes['BookCarouselComponent'] | ResolversTypes['BookGridComponent'] | ResolversTypes['BookListComponent'] | ResolversTypes['BookPageActionComponent'] | ResolversTypes['BookPageAuthorComponent'] | ResolversTypes['BookPageDescriptionComponent'] | ResolversTypes['BookPageDetailsComponent'] | ResolversTypes['BookPageGenreComponent'] | ResolversTypes['BookPageImageComponent'] | ResolversTypes['BookPagePriceComponent'] | ResolversTypes['HeroComponent'];
  HeroComponent: ResolverTypeWrapper<HeroComponent>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Layout: ResolversTypes['SingleColumnLayout'] | ResolversTypes['TwoColumnLayout'];
  LinkComponent: ResolverTypeWrapper<LinkComponent>;
  LinkVariant: LinkVariant;
  Node: ResolversTypes['AlertComponent'] | ResolversTypes['BannerComponent'] | ResolversTypes['BookCarouselComponent'] | ResolversTypes['BookCarouselItemComponent'] | ResolversTypes['BookGridComponent'] | ResolversTypes['BookGridItemComponent'] | ResolversTypes['BookListComponent'] | ResolversTypes['BookListItemComponent'] | ResolversTypes['BookPageActionComponent'] | ResolversTypes['BookPageAuthorComponent'] | ResolversTypes['BookPageDescriptionComponent'] | ResolversTypes['BookPageDetailsComponent'] | ResolversTypes['BookPageGenreComponent'] | ResolversTypes['BookPageImageComponent'] | ResolversTypes['BookPagePriceComponent'] | ResolversTypes['HeroComponent'] | ResolversTypes['LinkComponent'] | ResolversTypes['SingleColumnLayout'] | ResolversTypes['TwoColumnLayout'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  SingleColumnLayout: ResolverTypeWrapper<Omit<SingleColumnLayout, 'components'> & { components: Array<ResolversTypes['Component']> }>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TwoColumnLayout: ResolverTypeWrapper<Omit<TwoColumnLayout, 'bottomComponents' | 'leftComponents' | 'rightComponents' | 'topComponents'> & { bottomComponents: Array<ResolversTypes['Component']>, leftComponents: Array<ResolversTypes['Component']>, rightComponents: Array<ResolversTypes['Component']>, topComponents: Array<ResolversTypes['Component']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AlertComponent: AlertComponent;
  BannerComponent: BannerComponent;
  BookCarouselComponent: BookCarouselComponent;
  BookCarouselItemComponent: BookCarouselItemComponent;
  BookCarouselItemComponentConnection: BookCarouselItemComponentConnection;
  BookCarouselItemComponentEdge: BookCarouselItemComponentEdge;
  BookGridComponent: BookGridComponent;
  BookGridItemComponent: BookGridItemComponent;
  BookListComponent: BookListComponent;
  BookListItemComponent: BookListItemComponent;
  BookPageActionComponent: BookPageActionComponent;
  BookPageAuthorComponent: BookPageAuthorComponent;
  BookPageDescriptionComponent: BookPageDescriptionComponent;
  BookPageDetailsComponent: BookPageDetailsComponent;
  BookPageGenreComponent: BookPageGenreComponent;
  BookPageImageComponent: BookPageImageComponent;
  BookPagePriceComponent: BookPagePriceComponent;
  Boolean: Scalars['Boolean'];
  Component: ResolversParentTypes['AlertComponent'] | ResolversParentTypes['BannerComponent'] | ResolversParentTypes['BookCarouselComponent'] | ResolversParentTypes['BookGridComponent'] | ResolversParentTypes['BookListComponent'] | ResolversParentTypes['BookPageActionComponent'] | ResolversParentTypes['BookPageAuthorComponent'] | ResolversParentTypes['BookPageDescriptionComponent'] | ResolversParentTypes['BookPageDetailsComponent'] | ResolversParentTypes['BookPageGenreComponent'] | ResolversParentTypes['BookPageImageComponent'] | ResolversParentTypes['BookPagePriceComponent'] | ResolversParentTypes['HeroComponent'];
  HeroComponent: HeroComponent;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Layout: ResolversParentTypes['SingleColumnLayout'] | ResolversParentTypes['TwoColumnLayout'];
  LinkComponent: LinkComponent;
  Node: ResolversParentTypes['AlertComponent'] | ResolversParentTypes['BannerComponent'] | ResolversParentTypes['BookCarouselComponent'] | ResolversParentTypes['BookCarouselItemComponent'] | ResolversParentTypes['BookGridComponent'] | ResolversParentTypes['BookGridItemComponent'] | ResolversParentTypes['BookListComponent'] | ResolversParentTypes['BookListItemComponent'] | ResolversParentTypes['BookPageActionComponent'] | ResolversParentTypes['BookPageAuthorComponent'] | ResolversParentTypes['BookPageDescriptionComponent'] | ResolversParentTypes['BookPageDetailsComponent'] | ResolversParentTypes['BookPageGenreComponent'] | ResolversParentTypes['BookPageImageComponent'] | ResolversParentTypes['BookPagePriceComponent'] | ResolversParentTypes['HeroComponent'] | ResolversParentTypes['LinkComponent'] | ResolversParentTypes['SingleColumnLayout'] | ResolversParentTypes['TwoColumnLayout'];
  PageInfo: PageInfo;
  Query: {};
  SingleColumnLayout: Omit<SingleColumnLayout, 'components'> & { components: Array<ResolversParentTypes['Component']> };
  String: Scalars['String'];
  TwoColumnLayout: Omit<TwoColumnLayout, 'bottomComponents' | 'leftComponents' | 'rightComponents' | 'topComponents'> & { bottomComponents: Array<ResolversParentTypes['Component']>, leftComponents: Array<ResolversParentTypes['Component']>, rightComponents: Array<ResolversParentTypes['Component']>, topComponents: Array<ResolversParentTypes['Component']> };
};

export type AlertComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['AlertComponent'] = ResolversParentTypes['AlertComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  variant?: Resolver<ResolversTypes['AlertVariant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BannerComponent'] = ResolversParentTypes['BannerComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCarouselComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCarouselComponent'] = ResolversParentTypes['BookCarouselComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Maybe<ResolversTypes['BookCarouselItemComponentConnection']>, ParentType, ContextType, RequireFields<BookCarouselComponentItemsArgs, never>>;
  link?: Resolver<Maybe<ResolversTypes['LinkComponent']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCarouselItemComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCarouselItemComponent'] = ResolversParentTypes['BookCarouselItemComponent']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCarouselItemComponentConnectionResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCarouselItemComponentConnection'] = ResolversParentTypes['BookCarouselItemComponentConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['BookCarouselItemComponentEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookCarouselItemComponentEdgeResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookCarouselItemComponentEdge'] = ResolversParentTypes['BookCarouselItemComponentEdge']> = {
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['BookCarouselItemComponent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookGridComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookGridComponent'] = ResolversParentTypes['BookGridComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookGridItemComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookGridItemComponent'] = ResolversParentTypes['BookGridItemComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookListComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookListComponent'] = ResolversParentTypes['BookListComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookListItemComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookListItemComponent'] = ResolversParentTypes['BookListItemComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageActionComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageActionComponent'] = ResolversParentTypes['BookPageActionComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageAuthorComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageAuthorComponent'] = ResolversParentTypes['BookPageAuthorComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageDescriptionComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageDescriptionComponent'] = ResolversParentTypes['BookPageDescriptionComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageDetailsComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageDetailsComponent'] = ResolversParentTypes['BookPageDetailsComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageGenreComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageGenreComponent'] = ResolversParentTypes['BookPageGenreComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPageImageComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPageImageComponent'] = ResolversParentTypes['BookPageImageComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookPagePriceComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookPagePriceComponent'] = ResolversParentTypes['BookPagePriceComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Component'] = ResolversParentTypes['Component']> = {
  __resolveType: TypeResolveFn<'AlertComponent' | 'BannerComponent' | 'BookCarouselComponent' | 'BookGridComponent' | 'BookListComponent' | 'BookPageActionComponent' | 'BookPageAuthorComponent' | 'BookPageDescriptionComponent' | 'BookPageDetailsComponent' | 'BookPageGenreComponent' | 'BookPageImageComponent' | 'BookPagePriceComponent' | 'HeroComponent', ParentType, ContextType>;
};

export type HeroComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['HeroComponent'] = ResolversParentTypes['HeroComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LayoutResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Layout'] = ResolversParentTypes['Layout']> = {
  __resolveType: TypeResolveFn<'SingleColumnLayout' | 'TwoColumnLayout', ParentType, ContextType>;
};

export type LinkComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['LinkComponent'] = ResolversParentTypes['LinkComponent']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variant?: Resolver<ResolversTypes['LinkVariant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'AlertComponent' | 'BannerComponent' | 'BookCarouselComponent' | 'BookCarouselItemComponent' | 'BookGridComponent' | 'BookGridItemComponent' | 'BookListComponent' | 'BookListItemComponent' | 'BookPageActionComponent' | 'BookPageAuthorComponent' | 'BookPageDescriptionComponent' | 'BookPageDetailsComponent' | 'BookPageGenreComponent' | 'BookPageImageComponent' | 'BookPagePriceComponent' | 'HeroComponent' | 'LinkComponent' | 'SingleColumnLayout' | 'TwoColumnLayout', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  bookPageLayout?: Resolver<Maybe<ResolversTypes['Layout']>, ParentType, ContextType, RequireFields<QueryBookPageLayoutArgs, 'isbn'>>;
  collectionPageLayout?: Resolver<Maybe<ResolversTypes['Layout']>, ParentType, ContextType, RequireFields<QueryCollectionPageLayoutArgs, 'collectionId' | 'collectionType'>>;
  layout?: Resolver<Maybe<ResolversTypes['Layout']>, ParentType, ContextType, RequireFields<QueryLayoutArgs, 'layoutKey'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
};

export type SingleColumnLayoutResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['SingleColumnLayout'] = ResolversParentTypes['SingleColumnLayout']> = {
  components?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TwoColumnLayoutResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['TwoColumnLayout'] = ResolversParentTypes['TwoColumnLayout']> = {
  bottomComponents?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leftComponents?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  rightComponents?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  topComponents?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ResolverContext> = {
  AlertComponent?: AlertComponentResolvers<ContextType>;
  BannerComponent?: BannerComponentResolvers<ContextType>;
  BookCarouselComponent?: BookCarouselComponentResolvers<ContextType>;
  BookCarouselItemComponent?: BookCarouselItemComponentResolvers<ContextType>;
  BookCarouselItemComponentConnection?: BookCarouselItemComponentConnectionResolvers<ContextType>;
  BookCarouselItemComponentEdge?: BookCarouselItemComponentEdgeResolvers<ContextType>;
  BookGridComponent?: BookGridComponentResolvers<ContextType>;
  BookGridItemComponent?: BookGridItemComponentResolvers<ContextType>;
  BookListComponent?: BookListComponentResolvers<ContextType>;
  BookListItemComponent?: BookListItemComponentResolvers<ContextType>;
  BookPageActionComponent?: BookPageActionComponentResolvers<ContextType>;
  BookPageAuthorComponent?: BookPageAuthorComponentResolvers<ContextType>;
  BookPageDescriptionComponent?: BookPageDescriptionComponentResolvers<ContextType>;
  BookPageDetailsComponent?: BookPageDetailsComponentResolvers<ContextType>;
  BookPageGenreComponent?: BookPageGenreComponentResolvers<ContextType>;
  BookPageImageComponent?: BookPageImageComponentResolvers<ContextType>;
  BookPagePriceComponent?: BookPagePriceComponentResolvers<ContextType>;
  Component?: ComponentResolvers<ContextType>;
  HeroComponent?: HeroComponentResolvers<ContextType>;
  Layout?: LayoutResolvers<ContextType>;
  LinkComponent?: LinkComponentResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SingleColumnLayout?: SingleColumnLayoutResolvers<ContextType>;
  TwoColumnLayout?: TwoColumnLayoutResolvers<ContextType>;
};

