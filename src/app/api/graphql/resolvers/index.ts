import userResolvers from './userResolver';
import rulesResolvers from './rulesResolver';
import tournamentResolvers from './tournamentResolver';
import matchResolvers from './matchResolver';

const resolvers = [userResolvers, rulesResolvers, tournamentResolvers, matchResolvers];

export default resolvers;