import React, { useState, useEffect } from 'react';

export interface UseFormArgs<TForm> {
  form: TForm
}

export interface UseFormApi<TForm> {
  form: TForm
}

export function useForm<TForm>(props: UseFormArgs<TForm>): UseFormApi<TForm> {
  const [form, setForm] = useState<TForm>(props.form);

  return { form }
}