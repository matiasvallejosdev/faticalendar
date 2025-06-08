'use client';
import { useForm } from 'react-hook-form'; // Import SubmitHandler if needed for explicit typing
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { countries } from '@/data/countries';
import { useUserActions } from '@/src/hooks/use-user-actions';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  birthYear: z.coerce
    .number()
    .min(1900, { message: 'Must be after 1900' })
    .max(new Date().getFullYear(), { message: 'Cannot be in the future' }),
  nationality: z.string({
    required_error: 'Please select a country.',
  }),
  healthyFood: z.boolean().default(false),
  running: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  smoking: z.boolean().default(false),
});

type FormSchemaInput = z.input<typeof formSchema>;
type FormSchemaOutput = z.output<typeof formSchema>;

export function InitialForm() {
  const { setUserDataAction } = useUserActions();

  const form = useForm<FormSchemaInput, FormSchemaOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthYear: 1990,
      nationality: '',
      healthyFood: false,
      running: false,
      alcohol: false,
      smoking: false,
    },
  });

  // Modify the handleSubmit callback to align with TypeScript's expectation for form.handleSubmit
  // The 'data' parameter is typed as FormSchemaInput to satisfy the SubmitHandler<FormSchemaInput> expectation.
  // At runtime, react-hook-form passes the transformed (validated) data, which is FormSchemaOutput.
  // So, we use a type assertion to FormSchemaOutput.
  const handleSubmitCallback = (data: FormSchemaInput) => {
    const validatedData = data as FormSchemaOutput; // Assert to the actual runtime type
    setUserDataAction(validatedData);
  };

  return (
    <Card className="w-[450px] shadow-md bg-vintage-cream border-vintage-green text-vintage-green">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-vintage-green flex items-center justify-center">
            <Calendar className="h-6 w-6 text-vintage-green" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-vintage-green vintage-title">Faticalendar</CardTitle>
        <div className="vintage-divider"></div>
        <CardDescription className="text-vintage-green/80 text-center">
          Enter your information to visualize your life journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Pass the modified handleSubmitCallback */}
          <form onSubmit={form.handleSubmit(handleSubmitCallback)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-vintage-green">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="bg-vintage-cream border-vintage-green text-vintage-green placeholder:text-vintage-green/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            {/* Birth Year Field */}
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-vintage-green">Birth Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="bg-vintage-cream border-vintage-green text-vintage-green placeholder:text-vintage-green/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            {/* Nationality Field */}
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-vintage-green">Nationality</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-vintage-cream border-vintage-green text-vintage-green">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="bg-vintage-cream border-vintage-green text-vintage-green">
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-vintage-green">Lifestyle Factors</Label>

              <FormField
                control={form.control}
                name="healthyFood"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-vintage-green data-[state=checked]:bg-vintage-green data-[state=checked]:border-vintage-green"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-vintage-green">Healthy Food</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="running"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-vintage-green data-[state=checked]:bg-vintage-green data-[state=checked]:border-vintage-green"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-vintage-green">Running/Exercise</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alcohol"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-vintage-green data-[state=checked]:bg-vintage-green data-[state=checked]:border-vintage-green"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-vintage-green">Alcohol Consumption</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-vintage-green data-[state=checked]:bg-vintage-green data-[state=checked]:border-vintage-green"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-vintage-green">Smoking</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-vintage-green hover:bg-vintage-darkgreen text-vintage-cream">
              Start Visualization
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
