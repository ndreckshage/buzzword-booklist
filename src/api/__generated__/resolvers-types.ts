import { GraphQLResolveInfo } from 'graphql';
import { BookModel } from '../repo/books';
import { RootComponentModel, RootBookCarouselComponentModel, RootLayoutComponentModel } from '../repo/components';
import { ListModel } from '../repo/lists';
import { ResolverContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  href: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type BookGridComponent = {
  __typename?: 'BookGridComponent';
  id: Scalars['ID'];
};

export type BookListComponent = {
  __typename?: 'BookListComponent';
  id: Scalars['ID'];
};

export type Component = BookCardComponent | BookCarouselComponent | BookGridComponent | BookListComponent | HeroComponent | LayoutComponent;

export type HeroComponent = {
  __typename?: 'HeroComponent';
  id: Scalars['ID'];
  subTitle: Scalars['String'];
  title: Scalars['String'];
};

export type LayoutComponent = {
  __typename?: 'LayoutComponent';
  components: Array<Component>;
  id: Scalars['ID'];
};

export type List = {
  __typename?: 'List';
  books: Array<Book>;
  createdBy: Scalars['String'];
  id: Scalars['ID'];
  slug: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookToList?: Maybe<Scalars['Boolean']>;
  createList?: Maybe<Scalars['Boolean']>;
  removeBookFromList?: Maybe<Scalars['Boolean']>;
};


export type MutationAddBookToListArgs = {
  googleBooksVolumeId: Scalars['String'];
  listSlug: Scalars['String'];
};


export type MutationCreateListArgs = {
  title: Scalars['String'];
};


export type MutationRemoveBookFromListArgs = {
  googleBooksVolumeId: Scalars['String'];
  listSlug: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<Scalars['String']>;
  layout?: Maybe<LayoutComponent>;
  layoutWithBookContext?: Maybe<LayoutComponent>;
  layoutWithCollectionContext?: Maybe<LayoutComponent>;
  list?: Maybe<List>;
};


export type QueryLayoutArgs = {
  id: Scalars['ID'];
};


export type QueryLayoutWithBookContextArgs = {
  googleBooksVolumeId: Scalars['String'];
  id: Scalars['ID'];
};


export type QueryLayoutWithCollectionContextArgs = {
  collectionSlug: Scalars['String'];
  collectionType: Scalars['String'];
  id: Scalars['ID'];
};


export type QueryListArgs = {
  listSlug: Scalars['String'];
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
  BookCardComponent: ResolverTypeWrapper<RootComponentModel>;
  BookCarouselComponent: ResolverTypeWrapper<RootBookCarouselComponentModel>;
  BookGridComponent: ResolverTypeWrapper<RootComponentModel>;
  BookListComponent: ResolverTypeWrapper<RootComponentModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Component: ResolverTypeWrapper<RootComponentModel>;
  HeroComponent: ResolverTypeWrapper<RootComponentModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  LayoutComponent: ResolverTypeWrapper<RootLayoutComponentModel>;
  List: ResolverTypeWrapper<ListModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: BookModel;
  BookCardComponent: RootComponentModel;
  BookCarouselComponent: RootBookCarouselComponentModel;
  BookGridComponent: RootComponentModel;
  BookListComponent: RootComponentModel;
  Boolean: Scalars['Boolean'];
  Component: RootComponentModel;
  HeroComponent: RootComponentModel;
  ID: Scalars['ID'];
  LayoutComponent: RootLayoutComponentModel;
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
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookGridComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookGridComponent'] = ResolversParentTypes['BookGridComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookListComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['BookListComponent'] = ResolversParentTypes['BookListComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Component'] = ResolversParentTypes['Component']> = {
  __resolveType: TypeResolveFn<'BookCardComponent' | 'BookCarouselComponent' | 'BookGridComponent' | 'BookListComponent' | 'HeroComponent' | 'LayoutComponent', ParentType, ContextType>;
};

export type HeroComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['HeroComponent'] = ResolversParentTypes['HeroComponent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LayoutComponentResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['LayoutComponent'] = ResolversParentTypes['LayoutComponent']> = {
  components?: Resolver<Array<ResolversTypes['Component']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['List'] = ResolversParentTypes['List']> = {
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addBookToList?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddBookToListArgs, 'googleBooksVolumeId' | 'listSlug'>>;
  createList?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateListArgs, 'title'>>;
  removeBookFromList?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveBookFromListArgs, 'googleBooksVolumeId' | 'listSlug'>>;
};

export type QueryResolvers<ContextType = ResolverContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  layout?: Resolver<Maybe<ResolversTypes['LayoutComponent']>, ParentType, ContextType, RequireFields<QueryLayoutArgs, 'id'>>;
  layoutWithBookContext?: Resolver<Maybe<ResolversTypes['LayoutComponent']>, ParentType, ContextType, RequireFields<QueryLayoutWithBookContextArgs, 'googleBooksVolumeId' | 'id'>>;
  layoutWithCollectionContext?: Resolver<Maybe<ResolversTypes['LayoutComponent']>, ParentType, ContextType, RequireFields<QueryLayoutWithCollectionContextArgs, 'collectionSlug' | 'collectionType' | 'id'>>;
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType, RequireFields<QueryListArgs, 'listSlug'>>;
};

export type Resolvers<ContextType = ResolverContext> = {
  Book?: BookResolvers<ContextType>;
  BookCardComponent?: BookCardComponentResolvers<ContextType>;
  BookCarouselComponent?: BookCarouselComponentResolvers<ContextType>;
  BookGridComponent?: BookGridComponentResolvers<ContextType>;
  BookListComponent?: BookListComponentResolvers<ContextType>;
  Component?: ComponentResolvers<ContextType>;
  HeroComponent?: HeroComponentResolvers<ContextType>;
  LayoutComponent?: LayoutComponentResolvers<ContextType>;
  List?: ListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

