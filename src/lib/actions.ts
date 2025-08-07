'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export type UserData = {
  name: string;
  birthYear: number;
  nationality: string;
  healthyFood: boolean;
  running: boolean;
  alcohol: boolean;
  smoking: boolean;
};

export type UserDataWithId = UserData & {
  id: number;
};

export async function saveUserData(userData: UserData): Promise<UserDataWithId> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const { data, error } = await supabase
      .from('people')
      .insert([{
        name: userData.name,
        birth_year: userData.birthYear,
        nationality: userData.nationality,
        healthy_food: userData.healthyFood,
        running: userData.running,
        alcohol: userData.alcohol,
        smoking: userData.smoking,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to save user data');
    }

    // Transform the database response back to our client format
    return {
      id: data.id,
      name: data.name,
      birthYear: data.birth_year,
      nationality: data.nationality,
      healthyFood: data.healthy_food,
      running: data.running,
      alcohol: data.alcohol,
      smoking: data.smoking,
    };
  } catch (error) {
    console.error('Action error:', error);
    throw new Error('Failed to save user data');
  }
}

export async function updateUserData(userData: UserDataWithId): Promise<UserDataWithId> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const { data, error } = await supabase
      .from('people')
      .update({
        name: userData.name,
        birth_year: userData.birthYear,
        nationality: userData.nationality,
        healthy_food: userData.healthyFood,
        running: userData.running,
        alcohol: userData.alcohol,
        smoking: userData.smoking,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to update user data');
    }

    // Transform the database response back to our client format
    return {
      id: data.id,
      name: data.name,
      birthYear: data.birth_year,
      nationality: data.nationality,
      healthyFood: data.healthy_food,
      running: data.running,
      alcohol: data.alcohol,
      smoking: data.smoking,
    };
  } catch (error) {
    console.error('Action error:', error);
    throw new Error('Failed to update user data');
  }
}