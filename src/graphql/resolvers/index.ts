import userResolvers from './userResolver';
import rulesResolvers from './rulesResolver';
import tournamentResolvers from './tournamentResolver';
import matchResolvers from './matchResolver';
import seriesResolvers from './seriesResolver';

const resolvers = [userResolvers, rulesResolvers, tournamentResolvers, matchResolvers, seriesResolvers];

export default resolvers;